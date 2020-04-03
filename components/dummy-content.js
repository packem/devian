// Adapted from acdlite's notes on React Fiber

export default () =>
  `<p>
      React Fiber is an ongoing reimplementation of React&#39;s core algorithm.
      It is the culmination of over two years of research by the React team.
    </p>
    <p>
      The goal of React Fiber is to increase its suitability for areas like
      animation, layout, and gestures. Its headline feature is 
      <strong>incremental rendering</strong>: the ability to split rendering
      work into chunks and spread it out over multiple frames.
    </p>
    <p>
      Other key features include the ability to pause, abort, or reuse work as
      new updates come in; the ability to assign priority to different types of
      updates; and new concurrency primitives.
    </p>
    <h3 id="about-this-document">About this document</h3>
    <p>
      Fiber introduces several novel concepts that are difficult to grok solely
      by looking at code. This document began as a collection of notes I took as
      I followed along with Fiber&#39;s implementation in the React project. As
      it grew, I realized it may be a helpful resource for others, too.
    </p>
    <p>
      I&#39;ll attempt to use the plainest language possible, and to avoid
      jargon by explicitly defining key terms. I&#39;ll also link heavily to
      external resources when possible.
    </p>
    <p>
      Please note that I am not on the React team, and do not speak from any
      authority. <strong>This is not an official document</strong>. I have asked
      members of the React team to review it for accuracy.
    </p>
    <p>
      This is also a work in progress. 
      <strong>
        Fiber is an ongoing project that will likely undergo significant
        refactors before it&#39;s completed.
      </strong> 
      Also ongoing are my attempts at documenting its design here. Improvements
      and suggestions are highly welcome.
    </p>
    <p>
      My goal is that after reading this document, you will understand Fiber
      well enough to 
      <a href="https://github.com/facebook/react/commits/master/src/renderers/shared/fiber">
        follow along as it&#39;s implemented
      </a>
      , and eventually even be able to contribute back to React.
    </p>
    <h3 id="prerequisites">Prerequisites</h3>
    <p>
      I strongly suggest that you are familiar with the following resources
      before continuing:
    </p>
    <ul>
      <li>
        <a href="https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html">
          React Components, Elements, and Instances
        </a> 
        - &quot;Component&quot; is often an overloaded term. A firm grasp of
        these terms is crucial.
      </li>
      <li>
        <a href="https://facebook.github.io/react/docs/reconciliation.html">
          Reconciliation
        </a> 
        - A high-level description of React&#39;s reconciliation algorithm.
      </li>
      <li>
        <a href="https://github.com/reactjs/react-basic">
          React Basic Theoretical Concepts
        </a> 
        - A description of the conceptual model of React without implementation
        burden. Some of this may not make sense on first reading. That&#39;s
        okay, it will make more sense with time.
      </li>
      <li>
        <a href="https://facebook.github.io/react/contributing/design-principles.html">
          React Design Principles
        </a> 
        - Pay special attention to the section on scheduling. It does a great
        job of explaining the <em>why</em> of React Fiber.
      </li>
    </ul>
    <h2 id="review">Review</h2>
    <p>
      Please check out the prerequisites section if you haven&#39;t already.
    </p>
    <p>Before we dive into the new stuff, let&#39;s review a few concepts.</p>
    <h3 id="what-is-reconciliation-">What is reconciliation?</h3>
    <dl>
      <dt>reconciliation</dt>
      <dd>
        The algorithm React uses to diff one tree with another to determine
        which parts need to be changed.
      </dd>

      <dt>update</dt>
      <dd>
        A change in the data used to render a React app. Usually the result of 
        <code>setState</code>. Eventually results in a re-render.
      </dd>
    </dl>

    <p>
      The central idea of React&#39;s API is to think of updates as if they
      cause the entire app to re-render. This allows the developer to reason
      declaratively, rather than worry about how to efficiently transition the
      app from any particular state to another (A to B, B to C, C to A, and so
      on).
    </p>
    <p>
      Actually re-rendering the entire app on each change only works for the
      most trivial apps; in a real-world app, it&#39;s prohibitively costly in
      terms of performance. React has optimizations which create the appearance
      of whole app re-rendering while maintaining great performance. The bulk of
      these optimizations are part of a process called 
      <strong>reconciliation</strong>.
    </p>
    <p>
      Reconciliation is the algorithm behind what is popularly understood as the
      &quot;virtual DOM.&quot; A high-level description goes something like
      this: when you render a React application, a tree of nodes that describes
      the app is generated and saved in memory. This tree is then flushed to the
      rendering environment — for example, in the case of a browser application,
      it&#39;s translated to a set of DOM operations. When the app is updated
      (usually via <code>setState</code>), a new tree is generated. The new tree
      is diffed with the previous tree to compute which operations are needed to
      update the rendered app.
    </p>
    <p>
      Although Fiber is a ground-up rewrite of the reconciler, the high-level
      algorithm 
      <a href="https://facebook.github.io/react/docs/reconciliation.html">
        described in the React docs
      </a> 
      will be largely the same. The key points are:
    </p>
    <ul>
      <li>
        Different component types are assumed to generate substantially
        different trees. React will not attempt to diff them, but rather replace
        the old tree completely.
      </li>
      <li>
        Diffing of lists is performed using keys. Keys should be &quot;stable,
        predictable, and unique.&quot;
      </li>
    </ul>
    <h3 id="reconciliation-versus-rendering">
      Reconciliation versus rendering
    </h3>
    <p>
      The DOM is just one of the rendering environments React can render to, the
      other major targets being native iOS and Android views via React Native.
      (This is why &quot;virtual DOM&quot; is a bit of a misnomer.)
    </p>
    <p>
      The reason it can support so many targets is because React is designed so
      that reconciliation and rendering are separate phases. The reconciler does
      the work of computing which parts of a tree have changed; the renderer
      then uses that information to actually update the rendered app.
    </p>
    <p>
      This separation means that React DOM and React Native can use their own
      renderers while sharing the same reconciler, provided by React core.
    </p>
    <p>
      Fiber reimplements the reconciler. It is not principally concerned with
      rendering, though renderers will need to change to support (and take
      advantage of) the new architecture.
    </p>
    <h3 id="scheduling">Scheduling</h3>
    <dl>
      <dt>scheduling</dt>
      <dd>the process of determining when work should be performed.</dd>

      <dt>work</dt>
      <dd>
        any computations that must be performed. Work is usually the result of
        an update (e.g. <code>setState</code>).
      </dd>
    </dl>

    <p>
      React&#39;s 
      <a href="https://facebook.github.io/react/contributing/design-principles.html#scheduling">
        Design Principles
      </a> 
      document is so good on this subject that I&#39;ll just quote it here:
    </p>
    <blockquote>
      <p>
        In its current implementation React walks the tree recursively and calls
        render functions of the whole updated tree during a single tick. However
        in the future it might start delaying some updates to avoid dropping
        frames.
      </p>
      <p>
        This is a common theme in React design. Some popular libraries implement
        the &quot;push&quot; approach where computations are performed when the
        new data is available. React, however, sticks to the &quot;pull&quot;
        approach where computations can be delayed until necessary.
      </p>
      <p>
        React is not a generic data processing library. It is a library for
        building user interfaces. We think that it is uniquely positioned in an
        app to know which computations are relevant right now and which are not.
      </p>
      <p>
        If something is offscreen, we can delay any logic related to it. If data
        is arriving faster than the frame rate, we can coalesce and batch
        updates. We can prioritize work coming from user interactions (such as
        an animation caused by a button click) over less important background
        work (such as rendering new content just loaded from the network) to
        avoid dropping frames.
      </p>
    </blockquote>
    <p>The key points are:</p>
    <ul>
      <li>
        In a UI, it&#39;s not necessary for every update to be applied
        immediately; in fact, doing so can be wasteful, causing frames to drop
        and degrading the user experience.
      </li>
      <li>
        Different types of updates have different priorities — an animation
        update needs to complete more quickly than, say, an update from a data
        store.
      </li>
      <li>
        A push-based approach requires the app (you, the programmer) to decide
        how to schedule work. A pull-based approach allows the framework (React)
        to be smart and make those decisions for you.
      </li>
    </ul>
    <p>
      React doesn&#39;t currently take advantage of scheduling in a significant
      way; an update results in the entire subtree being re-rendered
      immediately. Overhauling React&#39;s core algorithm to take advantage of
      scheduling is the driving idea behind Fiber.
    </p>
    <hr />
    <p>
      Now we&#39;re ready to dive into Fiber&#39;s implementation. The next
      section is more technical than what we&#39;ve discussed so far. Please
      make sure you&#39;re comfortable with the previous material before moving
      on.
    </p>
    <h2 id="what-is-a-fiber-">What is a fiber?</h2>
    <p>
      We&#39;re about to discuss the heart of React Fiber&#39;s architecture.
      Fibers are a much lower-level abstraction than application developers
      typically think about. If you find yourself frustrated in your attempts to
      understand it, don&#39;t feel discouraged. Keep trying and it will
      eventually make sense. (When you do finally get it, please suggest how to
      improve this section.)
    </p>
    <p>Here we go!</p>
    <p>
      We&#39;ve established that a primary goal of Fiber is to enable React to
      take advantage of scheduling. Specifically, we need to be able to
    </p>
    <ul>
      <li>pause work and come back to it later.</li>
      <li>assign priority to different types of work.</li>
      <li>reuse previously completed work.</li>
      <li>abort work if it&#39;s no longer needed.</li>
    </ul>
    <p>
      In order to do any of this, we first need a way to break work down into
      units. In one sense, that&#39;s what a fiber is. A fiber represents a 
      <strong>unit of work</strong>.
    </p>
    <p>
      To go further, let&#39;s go back to the conception of 
      <a href="https://github.com/reactjs/react-basic#transformation">
        React components as functions of data
      </a>
      , commonly expressed as
    </p>
    <pre>
      <code>
        <span className="hljs-attr">v</span> = f(d)
      </code>
    </pre>
    <p>
      It follows that rendering a React app is akin to calling a function whose
      body contains calls to other functions, and so on. This analogy is useful
      when thinking about fibers.
    </p>
    <p>
      The way computers typically track a program&#39;s execution is using the 
      <a href="https://en.wikipedia.org/wiki/Call_stack">call stack</a>. When a
      function is executed, a new <strong>stack frame</strong> is added to the
      stack. That stack frame represents the work that is performed by that
      function.
    </p>
    <p>
      When dealing with UIs, the problem is that if too much work is executed
      all at once, it can cause animations to drop frames and look choppy.
      What&#39;s more, some of that work may be unnecessary if it&#39;s
      superseded by a more recent update. This is where the comparison between
      UI components and function breaks down, because components have more
      specific concerns than functions in general.
    </p>
    <p>
      Newer browsers (and React Native) implement APIs that help address this
      exact problem: <code>requestIdleCallback</code> schedules a low priority
      function to be called during an idle period, and 
      <code>requestAnimationFrame</code> schedules a high priority function to
      be called on the next animation frame. The problem is that, in order to
      use those APIs, you need a way to break rendering work into incremental
      units. If you rely only on the call stack, it will keep doing work until
      the stack is empty.
    </p>
    <p>
      Wouldn&#39;t it be great if we could customize the behavior of the call
      stack to optimize for rendering UIs? Wouldn&#39;t it be great if we could
      interrupt the call stack at will and manipulate stack frames manually?
    </p>
    <p>
      That&#39;s the purpose of React Fiber. Fiber is reimplementation of the
      stack, specialized for React components. You can think of a single fiber
      as a <strong>virtual stack frame</strong>.
    </p>
    <p>
      The advantage of reimplementing the stack is that you can 
      <a href="https://www.facebook.com/groups/2003630259862046/permalink/2054053404819731/">
        keep stack frames in memory
      </a> 
      and execute them however (and <em>whenever</em>) you want. This is crucial
      for accomplishing the goals we have for scheduling.
    </p>
    <p>
      Aside from scheduling, manually dealing with stack frames unlocks the
      potential for features such as concurrency and error boundaries. We will
      cover these topics in future sections.
    </p>
    <p>In the next section, we&#39;ll look more at the structure of a fiber.</p>
    <h3 id="structure-of-a-fiber">Structure of a fiber</h3>
    <p>
      <em>
        Note: as we get more specific about implementation details, the
        likelihood that something may change increases. Please file a PR if you
        notice any mistakes or outdated information.
      </em>
    </p>
    <p>
      In concrete terms, a fiber is a JavaScript object that contains
      information about a component, its input, and its output.
    </p>
    <p>
      A fiber corresponds to a stack frame, but it also corresponds to an
      instance of a component.
    </p>
`;
