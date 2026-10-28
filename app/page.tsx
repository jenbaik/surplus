export default function Home() {
  return (
    <>
      {/* =================== MASTHEAD =================== */}
      {/* <header>
        <div className="flex flex-wrap items-center justify-between gap-5 bg-ink-dark px-6 py-1.5 font-mono text-sm uppercase tracking-widest text-paper max-bp:flex-nowrap max-bp:justify-center max-bp:gap-2.5 max-bp:px-4 max-bp:py-2.5">
          <span>☞&nbsp;&nbsp;Cohort begins July 20</span>
          <span className="max-bp:hidden">
            <b className="text-ink-yellow">Applications open</b> · Deadline Jul 10 · Rolling decisions
          </span>
          <span className="max-bp:hidden">$100K + SAFE · 12 weeks · Berkeley</span>
        </div>
      </header> */}

      {/* =================== HERO =================== */}
      <section className="relative overflow-visible pb-14 pt-9 max-bp:pb-10 max-bp:pt-9">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div
            className="pointer-events-none absolute right-[-160px] top-[110px] z-0 h-80 w-80 opacity-85 max-bp:hidden"
            aria-hidden="true"
          >
            <svg
              className="absolute -inset-0 h-full w-full text-ink-dark opacity-95 mix-blend-multiply"
              viewBox="0 0 320 320"
            >
              <path
                d="M106 7 H214 V106 H313 V214 H214 V313 H106 V214 H7 V106 H106 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
              />
            </svg>
            <div className="halftone absolute inset-6 opacity-65 mix-blend-multiply [clip-path:polygon(33%_0,67%_0,67%_33%,100%_33%,100%_67%,67%_67%,67%_100%,33%_100%,33%_67%,0_67%,0_33%,33%_33%)]"></div>
          </div>

          <div className="mb-[18px] flex flex-wrap items-center gap-3 max-bp:hidden">
            <span className="whitespace-nowrap bg-ink-dark px-3 py-1.5 font-mono text-sm uppercase tracking-widest text-paper">
              A Software Incubator
            </span>
            <span className="whitespace-nowrap bg-ink-pink px-3 py-1.5 font-mono text-sm uppercase tracking-widest text-paper">
              For <b className="font-bold text-ink-dark">Massive Public Good</b>
            </span>
            <span className="font-display text-xl leading-none text-ink-blue">✻</span>
            <span className="whitespace-nowrap bg-ink-dark px-3 py-1.5 font-mono text-sm uppercase tracking-widest text-paper">
              In the Age of <b className="font-bold text-ink-yellow">Transformative AI</b>
            </span>
          </div>
          <p className="m-0 mb-3 hidden font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-ink-dark max-bp:block">
            A software incubator for <b className="font-bold text-ink-pink">massive public good</b> in
            the age of <b className="font-bold text-ink-blue">transformative AI</b>
          </p>

          <h1 className="misreg relative m-0 font-display text-[clamp(76px,18vw,276px)] leading-[0.8] tracking-[-0.045em] text-ink-dark max-bp:whitespace-nowrap max-bp:text-[clamp(54px,17.5vw,124px)] max-bp:tracking-[-0.055em]">
            SUR<span className="misreg-accent text-ink-pink">PLUS</span>
          </h1>

          <div className="mt-1 flex items-baseline justify-between border-t-[3px] border-ink-dark pt-2.5 font-mono text-sm uppercase tracking-widest max-bp:flex-col max-bp:items-start max-bp:gap-1.5">
            <span>☞&nbsp;&nbsp;Organized by Manifund &amp; Mox</span>
            <span className="max-bp:hidden">3 months · starting early August</span>
            <span className="max-bp:hidden">San Francisco</span>
            <span className="max-bp:hidden"></span>
            <span className="max-bp:hidden"></span>
          </div>

          <div className="relative z-[1] mt-6 grid grid-cols-[1.35fr_1fr] items-start gap-10 max-bp:mt-7 max-bp:grid-cols-1 max-bp:gap-7">
            <div>
              <p className="max-w-[34ch] font-serif text-2xl font-medium leading-[1.22] text-ink-dark [&_em]:italic [&_em]:text-ink-blue [&_mark]:bg-ink-yellow [&_mark]:px-1 [&_mark]:text-ink-dark max-bp:max-w-none">
                &ldquo;<em>Surplus</em>&rdquo; is the value created <br />through{" "}
                <mark>positive-sum trades</mark>;<br /> what markets produce in abundance.
              </p>
              <figure className="m-0 mt-4 max-w-[420px] max-bp:max-w-[380px]">
                <svg
                  viewBox="0 0 640 560"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Supply and demand graph with consumer and producer surplus shaded in two inks"
                  className="block h-auto w-full"
                >
                  <defs>
                    <pattern id="surplus-dots-blue" width="9" height="9" patternUnits="userSpaceOnUse">
                      <circle cx="4.5" cy="4.5" r="2.1" fill="var(--color-ink-blue)" />
                    </pattern>
                    <pattern id="surplus-dots-pink" width="9" height="9" patternUnits="userSpaceOnUse">
                      <circle cx="4.5" cy="4.5" r="2.4" fill="var(--color-ink-pink)" />
                    </pattern>
                  </defs>

                  {/* surplus plates, nudged off-register */}
                  <g className="mix-blend-multiply" opacity="0.8">
                    <path d="M100,100 L330,280 L100,280 Z" fill="url(#surplus-dots-blue)" transform="translate(-4,-3)" />
                    <path d="M100,460 L330,280 L100,280 Z" fill="url(#surplus-dots-pink)" transform="translate(4,3)" />
                  </g>

                  {/* equilibrium dotted lines */}
                  <g stroke="var(--color-ink-dark)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8">
                    <line x1="80" y1="280" x2="330" y2="280" strokeDasharray="1 9" />
                    <line x1="330" y1="280" x2="330" y2="480" strokeDasharray="1 9" />
                  </g>

                  {/* curves */}
                  <g strokeLinecap="round" fill="none" className="mix-blend-multiply">
                    <line x1="100" y1="100" x2="560" y2="460" stroke="var(--color-ink-blue)" strokeWidth="7" />
                    <line x1="100" y1="460" x2="560" y2="100" stroke="var(--color-ink-pink)" strokeWidth="7" />
                  </g>

                  {/* axes */}
                  <g>
                    <line x1="80" y1="480" x2="80" y2="55" stroke="var(--color-ink-dark)" strokeWidth="4" />
                    <line x1="80" y1="480" x2="585" y2="480" stroke="var(--color-ink-dark)" strokeWidth="4" />
                    <path d="M80,43 L73,57 L87,57 Z" fill="var(--color-ink-dark)" />
                    <path d="M597,480 L583,473 L583,487 Z" fill="var(--color-ink-dark)" />
                    <text
                      x="58"
                      y="59"
                      transform="rotate(-90 58 59)"
                      textAnchor="end"
                      fontFamily="var(--font-condensed)"
                      fontWeight="700"
                      fontSize="21"
                      letterSpacing="3"
                      fill="var(--color-ink-dark)"
                    >
                      PRICE
                    </text>
                    <text
                      x="585"
                      y="514"
                      textAnchor="end"
                      fontFamily="var(--font-condensed)"
                      fontWeight="700"
                      fontSize="21"
                      letterSpacing="3"
                      fill="var(--color-ink-dark)"
                    >
                      QUANTITY
                    </text>
                  </g>

                  {/* equilibrium ticks */}
                  <g fontFamily="var(--font-mono)" fontWeight="400" fontSize="15" fill="var(--color-ink-dark)" opacity="0.72">
                    <text x="68" y="285" textAnchor="end">
                      P*
                    </text>
                    <text x="330" y="504" textAnchor="middle">
                      Q*
                    </text>
                  </g>

                  {/* curve labels */}
                  <text
                    x="472"
                    y="148"
                    transform="rotate(-38 472 148)"
                    textAnchor="middle"
                    fontFamily="var(--font-condensed)"
                    fontWeight="700"
                    fontSize="23"
                    letterSpacing="2.5"
                    fill="var(--color-ink-pink)"
                  >
                    SUPPLY
                  </text>
                  <text
                    x="472"
                    y="434"
                    transform="rotate(38 472 434)"
                    textAnchor="middle"
                    fontFamily="var(--font-condensed)"
                    fontWeight="700"
                    fontSize="23"
                    letterSpacing="2.5"
                    fill="var(--color-ink-blue)"
                  >
                    DEMAND
                  </text>
                </svg>
              </figure>
            </div>

            <aside className="relative flex flex-col items-stretch gap-5">
              <div className="border-[3px] border-ink-dark bg-paper">
                <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">$100K</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
                      Seed funding
                    </span>
                    <span className="font-mono text-[13px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      $2M post-money cap
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">3</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
                      Months of programming
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">~10</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
                      Founders in the cohort
                    </span>
                    <span className="font-mono text-[13px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      High intensity, tight knit
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2 max-bp:justify-center">
                <a
                  href="https://airtable.com/appaxqJfxht7OronH/pag4BXQJgRUkdb6lQ/form"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Express your interest in a future round"
                  className="relative inline-block h-[230px] w-[230px] -rotate-6 cursor-pointer no-underline transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-105 active:rotate-[-2deg] active:scale-[0.99] max-bp:h-[190px] max-bp:w-[190px]"
                >
                  <span className="absolute inset-0 z-[-1] translate-x-2 translate-y-2 rounded-full bg-ink-blue opacity-90 mix-blend-multiply"></span>
                  <span className="absolute inset-0 grid place-items-center rounded-full bg-ink-pink text-center text-paper shadow-[inset_0_0_0_4px_var(--color-paper),inset_0_0_0_6px_var(--color-ink-pink)]">
                    <span className="flex flex-col items-center gap-1.5 px-6">
                      <span className="font-display text-[26px] leading-[0.95] tracking-wide max-bp:text-xl">
                        EXPRESS
                        <br />
                        YOUR
                        <br />
                        INTEREST
                      </span>
                      <span className="font-mono text-sm uppercase tracking-widest max-bp:text-xs">In a future round</span>
                      <span className="mt-0.5 font-display text-xl tracking-wider">☞ ☞ ☞</span>
                    </span>
                  </span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =================== MANIFESTO =================== */}
      <section className="relative border-b-[3px] border-t-8 border-ink-dark pb-7">
        <div className="mb-9 bg-ink-dark px-10 py-4 text-center font-condensed text-[clamp(18px,2.2vw,26px)] font-bold uppercase leading-tight tracking-wider text-paper max-bp:px-5 max-bp:py-3.5 max-bp:text-sm">
          —&nbsp;&nbsp;Seed funding · Advice · Peers · Intros ·{" "}
          <em className="not-italic text-ink-yellow">Space to focus</em>&nbsp;&nbsp;—
        </div>
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[180px_1fr_180px] gap-7 pt-4 max-bp:grid-cols-1 max-bp:gap-5">
            <div className="font-mono text-sm uppercase leading-normal tracking-widest">
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Who</span>
              <span className="mt-1 block opacity-85">Founders who care about xrisk and flourishing futures.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Where</span>
              <span className="mt-1 block opacity-85">Office space at Mox, San Francisco.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;When</span>
              <span className="mt-1 block opacity-85">12 weeks, starting early August.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Cohort</span>
              <span className="mt-1 block opacity-85">~10 founders.</span>
            </div>

            <div className="min-w-0 break-words text-base leading-relaxed [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[1.4em]">
              <p className="first-letter:float-left first-letter:pr-2.5 first-letter:pt-1.5 first-letter:font-display first-letter:text-[82px] first-letter:leading-[0.85] first-letter:text-ink-pink max-bp:first-letter:text-6xl">
                Surplus is an incubator for software startups, organized by <em>Manifund</em> and{" "}
                <em>Mox</em> — to create <b>massive public good</b> in the age of transformative
                AI. It&rsquo;s a 3 month program, starting early August in SF. We provide seed
                funding, advice, peers, intros, and space to focus.
              </p>
              <p>
                Now is an excellent time to start a for-profit, given{" "}
                <a
                  href="https://nanransohoff.substack.com/p/the-third-wave-of-american-philanthropy"
                  className="text-ink-blue underline underline-offset-2 hover:bg-ink-yellow hover:text-ink-dark hover:no-underline"
                >
                  vast torrents of funding
                </a>{" "}
                available from Anthropic employees and OpenAI Foundation. 501c3s can pay for
                for-profit services, and invest in for-profit corps. There&rsquo;s a $100B market
                waiting to be constructed; <em>shovels waiting to be sold</em>.
              </p>
              <p>
                Building great software takes more than coding.{" "}
                <b>Product taste, visual design, distribution, sales and marketing</b> are all
                things that 2026 LLMs still fail at. We&rsquo;ve developed these supplementary
                skills needed to ship successful products, and would love to foster them in a new
                generation of founders.
              </p>
            </div>

            <div className="text-right font-mono text-sm uppercase leading-normal tracking-widest max-bp:text-left">
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;The deal</span>
              <span className="mt-1 block opacity-85">$100k SAFE, at a $2m post-money cap.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Office hours</span>
              <span className="mt-1 block opacity-85">Weekly office hours and mentorship.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Deadline</span>
              <span className="mt-1 block opacity-85">Applications due July 10; rolling decisions, so apply soon.</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================== PROJECTS =================== */}
      <section className="pb-10 pt-7">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">01</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
              Projects We&rsquo;re Excited For
            </h2>
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] items-start gap-10 pb-12 pt-9 max-bp:grid-cols-1 max-bp:gap-4 max-bp:pb-7 max-bp:pt-6">
            <p className="font-serif text-xl leading-snug [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue max-bp:text-lg">
              We&rsquo;re open to many proposals, but here are <b>three categories</b> of projects
              we&rsquo;re well-suited to incubate. If your idea is adjacent —{" "}
              <em>apply anyway</em>.
            </p>
            <div className="self-end text-right font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:self-start max-bp:text-left max-bp:text-4xl">
              ☞ ☞ ☞
            </div>
          </div>

          <div className="grid grid-cols-3 border-l-[3px] border-t-[3px] border-ink-dark max-bp:grid-cols-1">
            <article className="relative flex min-h-[540px] flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-[26px] pb-[30px] pt-7 max-bp:min-h-0">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-3.5 h-[50px] w-[50px] rounded-full bg-ink-yellow opacity-70 mix-blend-multiply"
              ></span>
              <div className="relative z-[1] mb-[18px] flex items-start gap-4">
                <span className="font-display text-7xl leading-none text-ink-pink misreg-blue shrink-0">01</span>
                <h3 className="relative z-[1] mt-1.5 font-condensed text-xl font-bold uppercase leading-tight tracking-wide">
                  AI for Epistemics &amp; Coordination
                </h3>
              </div>
              <p className="mb-[18px] font-serif text-base italic leading-snug text-ink-dark">
                LLM-powered tools that help people think better, work together, and build common
                knowledge.
              </p>
              <div className="mb-3 border-y-[1.5px] border-ink-dark py-1.5 font-mono text-sm uppercase tracking-widest text-ink-blue">
                — Examples —
              </div>
              <ul className="font-serif text-sm leading-snug [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_li:last-child]:border-b-0 [&_li]:relative [&_li]:border-b [&_li]:border-dotted [&_li]:border-ink-dark/40 [&_li]:py-[7px] [&_li]:pl-[22px] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:text-sm [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
                <li>
                  Fact-checking like{" "}
                  <a href="https://communitynotes.x.com/guide/en/about/introduction">
                    Community Notes
                  </a>{" "}
                  or <a href="https://www.pangram.com/">Pangram</a>
                </li>
                <li>
                  Guardian angels / &ldquo;Digital Twins&rdquo;, as{" "}
                  <a href="https://gwern.net/guardian-angel">described by Gwern</a>
                </li>
                <li>
                  Knowledge bases like <a href="https://grokipedia.com/">Grokipedia</a> or{" "}
                  <a href="https://www.longtermwiki.com/">Longterm Wiki</a>
                </li>
                <li>
                  Research reports like <a href="https://elicit.com/">Elicit</a> or Deep Research
                </li>
                <li>
                  AI forecasting like <a href="https://www.mantic.com/">Mantic</a> or{" "}
                  <a href="https://futuresearch.ai/">Futuresearch</a>
                </li>
                <li>
                  AI simulation of human preferences, like <a href="https://simile.ai/">Simile</a>{" "}
                  or <a href="https://aaru.com/">Aaru</a>
                </li>
                <li>
                  AI for dispute resolution — community investigations; prediction-market criteria
                </li>
                <li>AI for democratic resilience, resisting authoritarianism</li>
              </ul>
            </article>

            <article className="relative flex min-h-[540px] flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-[26px] pb-[30px] pt-7 max-bp:min-h-0">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-3.5 h-14 w-14 bg-[repeating-linear-gradient(45deg,var(--color-ink-blue)_0_3px,transparent_3px_8px)] opacity-55 mix-blend-multiply"
              ></span>
              <div className="relative z-[1] mb-[18px] flex items-start gap-4">
                <span className="font-display text-7xl leading-none text-ink-blue misreg-pink shrink-0">02</span>
                <h3 className="relative z-[1] mt-1.5 font-condensed text-xl font-bold uppercase leading-tight tracking-wide">
                  Public-Facing Websites
                </h3>
              </div>
              <p className="mb-[18px] font-serif text-base italic leading-snug text-ink-dark">
                Many important concepts could be translated for a wider audience, with thoughtful
                design and an eye for virality.
              </p>
              <div className="mb-3 border-y-[1.5px] border-ink-dark py-1.5 font-mono text-sm uppercase tracking-widest text-ink-blue">
                — Examples —
              </div>
              <ul className="font-serif text-sm leading-snug [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_li:last-child]:border-b-0 [&_li]:relative [&_li]:border-b [&_li]:border-dotted [&_li]:border-ink-dark/40 [&_li]:py-[7px] [&_li]:pl-[22px] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:text-sm [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
                <li>
                  Microsites like <a href="https://ai-2027.com/">AI 2027</a>, showcasing concepts
                  through narrative &amp; interactive design
                </li>
                <li>
                  Visualizations like <a href="https://epoch.ai/">Epoch</a> and{" "}
                  <a href="https://ourworldindata.org/">Our World in Data</a>
                </li>
                <li>Transparency for what&rsquo;s happening inside labs, and across the AI supply chain</li>
                <li>
                  Courses like <a href="https://bluedot.org/">Bluedot</a>, helping people upskill
                  into relevant domains
                </li>
                <li>
                  Demos like <a href="https://aisafety.dance/">Nicky Case&rsquo;s</a>, or of topics
                  from recent alignment research papers
                </li>
                <li>
                  Games like <a href="https://manifold.markets">Manifold</a> or{" "}
                  <a href="https://www.decisionproblem.com/paperclips/">Universal Paperclips</a>,
                  teaching concepts through play
                </li>
              </ul>
            </article>

            <article className="relative flex min-h-[540px] flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-[26px] pb-[30px] pt-7 max-bp:min-h-0">
              <span
                aria-hidden="true"
                className="halftone pointer-events-none absolute right-3.5 top-3.5 h-16 w-16 opacity-80 mix-blend-multiply [--dot-gap:9px] [--dot:2.2px]"
              ></span>
              <div className="relative z-[1] mb-[18px] flex items-start gap-4">
                <span className="font-display text-7xl leading-none text-ink-dark misreg-pink shrink-0">03</span>
                <h3 className="relative z-[1] mt-1.5 font-condensed text-xl font-bold uppercase leading-tight tracking-wide">
                  Community infra
                </h3>
              </div>
              <p className="mb-[18px] font-serif text-base italic leading-snug text-ink-dark">
                Marketplaces or platforms, addressing common problems in EA, AI safety, and others working towards a beautiful future
              </p>
              <div className="mb-3 border-y-[1.5px] border-ink-dark py-1.5 font-mono text-sm uppercase tracking-widest text-ink-blue">
                — Examples —
              </div>
              <ul className="font-serif text-sm leading-snug [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_li:last-child]:border-b-0 [&_li]:relative [&_li]:border-b [&_li]:border-dotted [&_li]:border-ink-dark/40 [&_li]:py-[7px] [&_li]:pl-[22px] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:text-sm [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
                <li>
                  Job platforms like the <a href="https://jobs.80000hours.org/">80k Job Board</a>{" "}
                  or an &ldquo;AI safety LinkedIn&rdquo;
                </li>
                <li>Or other opportunities — fellowships, grassroots political coordination</li>
                <li>
                  Funding platforms like <a href="https://manifund.org/">Manifund</a> or an
                  open-source{" "}
                  <a href="https://survivalandflourishing.fund/s-process">S-process</a>
                </li>
                <li>
                  Whitelabeled microgrant platforms like{" "}
                  <a href="https://www.astralcodexten.com/p/apply-for-an-acx-grant-2025">
                    ACX Grants
                  </a>{" "}
                  or <a href="https://bluedot.org/programs/rapid-grants">Bluedot Rapid Grants</a>
                </li>
                <li>AI-powered grantmaking and review</li>
                <li>
                  Writing platforms like <a href="https://www.lesswrong.com/">LessWrong</a>,{" "}
                  <a href="https://forum.effectivealtruism.org/">EA Forum</a>,{" "}
                  <a href="https://www.alignmentforum.org/">Alignment Forum</a>
                </li>
                <li>
                  Research platforms like <a href="https://distill.pub/">Distill</a> or{" "}
                  <a href="https://www.unjournal.org/">Unjournal</a>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =================== OFFERS =================== */}
      <section className="pb-14 pt-9">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">02</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
              What We Offer
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 max-bp:grid-cols-1">
            <div className="relative flex min-h-[220px] flex-col border-[3px] border-ink-dark bg-ink-pink px-[18px] pb-5 pt-[22px] text-paper max-bp:min-h-0">
              <div className="font-mono text-sm uppercase tracking-widest opacity-70">No. 01 — Capital</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                <span className="font-display text-6xl leading-none max-bp:text-5xl">$100K</span>
                <br />
                investment, as a SAFE
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                At a $2m post-money cap. (Maybe a grant if you&rsquo;re a committed nonprofit, but
                we&rsquo;ll try to argue you out of this.)
              </div>
            </div>

            <div className="relative flex min-h-[220px] flex-col border-[3px] border-ink-dark bg-paper px-[18px] pb-5 pt-[22px] max-bp:min-h-0">
              <div className="font-mono text-sm uppercase tracking-widest opacity-70">No. 02 — Cohort</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                A cohort of <span className="text-ink-pink">~10 founders</span>
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                Work alongside others who care about xrisk and flourishing futures.
              </div>
            </div>

            <div className="relative flex min-h-[220px] flex-col border-[3px] border-ink-dark bg-paper px-[18px] pb-5 pt-[22px] max-bp:min-h-0">
              <div className="font-mono text-sm uppercase tracking-widest opacity-70">No. 03 — Mentorship</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                Office hours &amp; mentorship
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                Every week of the program.
              </div>
            </div>

            <div className="relative flex min-h-[220px] flex-col border-[3px] border-ink-dark bg-ink-dark px-[18px] pb-5 pt-[22px] text-paper max-bp:min-h-0">
              <div className="font-mono text-sm uppercase tracking-widest opacity-70">No. 04 — Dinners</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                Dinners with <span className="text-ink-yellow">speakers</span>
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                Shared meals with founders we admire.
              </div>
            </div>

            <div className="relative flex min-h-[220px] flex-col border-[3px] border-ink-dark bg-paper px-[18px] pb-5 pt-[22px] max-bp:min-h-0">
              <div className="font-mono text-sm uppercase tracking-widest opacity-70">No. 05 — Place</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                Office space at Mox
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                A space to focus, in San Francisco.
              </div>
            </div>

            <div className="relative flex min-h-[220px] flex-col border-[3px] border-ink-dark bg-ink-yellow px-[18px] pb-5 pt-[22px] max-bp:min-h-0">
              <div className="font-mono text-sm uppercase tracking-widest opacity-70">No. 06 — Demo Day</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                Demo Day, <span className="text-ink-pink">Oct 23</span>
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                Pitch to aligned VCs and philanthropic funders.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== TIMELINE =================== */}
      <section className="pb-12 pt-8">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">03</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">Timeline: What Batch 1 looked like</h2>
          </div>

          <div className="mt-8 border-t-[3px] border-ink-dark">
            <div className="grid grid-cols-[160px_60px_1fr] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Jun 12</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <div>
                <div className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Applications Open
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Jun 24</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <div>
                <div className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Early Applications Due
                </div>
                <div className="mt-1.5 font-serif text-sm italic text-ink-dark">
                  Apply early for priority review; rolling video interviews.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Jul 10</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <div>
                <div className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Applications Due
                </div>
                <div className="mt-1.5 font-serif text-sm italic text-ink-dark">
                  Final deadline; rolling video interviews continue.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Aug 3</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <div>
                <div className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Program Kickoff
                </div>
                <ul className="mt-1.5 list-none font-serif text-sm italic text-ink-dark [&_li]:py-0.5 [&_li]:before:text-ink-pink [&_li]:before:content-['—_']">
                  <li>2 weeks of ideating &amp; cofounder matching</li>
                  <li>10 weeks of mentorship, dinners with speakers</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Oct 23</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <div>
                <div className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Demo Day
                </div>
                <div className="mt-1.5 font-serif text-sm italic text-ink-dark">
                  Pitch to an audience of angels, VCs and philanthropic funders.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== VIRTUES =================== */}
      <section className="relative mt-12 overflow-hidden border-y-[3px] border-t-8 border-ink-dark bg-paper-deep pb-16 pt-2 max-bp:mt-8 max-bp:pb-10">
        <span
          aria-hidden="true"
          className="halftone pointer-events-none absolute -right-[140px] top-[210px] h-[340px] w-[340px] opacity-40 mix-blend-multiply [--dot-gap:12px] [--dot:2.6px] max-bp:hidden"
        ></span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[110px] -left-[90px] h-[280px] w-[280px] rounded-full bg-ink-yellow opacity-35 mix-blend-multiply"
        ></span>
        <div className="relative z-[1] mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-12 max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-8">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">04</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
              Virtues We Cherish
            </h2>
          </div>

          <p className="max-w-[40ch] pb-9 pt-8 font-serif text-xl leading-snug max-bp:pb-6 max-bp:pt-5 max-bp:text-lg">
            We&rsquo;re seeking founders who are:
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-5 max-bp:gap-x-3.5 max-bp:gap-y-3.5">
            <span className="inline-block -rotate-2 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-pink transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Loving, wholesome, earnest
            </span>
            <span className="inline-block rotate-1 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-blue transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Humble, called to serve, takes out the trash
            </span>
            <span className="inline-block -rotate-1 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-dark transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Caring, obsessive, dedicated to craft
            </span>
            <span className="inline-block rotate-2 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-blue transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Fast, iterative, gets things done
            </span>
            <span className="inline-block rotate-[-3deg] border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-pink transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Idealistic, optimistic, dreamers
            </span>
            <span className="inline-block rotate-[1.5deg] border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-dark transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Scrappy, resourceful, practical
            </span>
            <span className="inline-block -rotate-1 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-blue transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Open, honest, works in public
            </span>
            <span className="inline-block rotate-2 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-pink transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Naughty, humorous, spirited
            </span>
            <span className="inline-block -rotate-2 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-dark transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Honorable, trustworthy
            </span>
            <span className="inline-block rotate-1 border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-pink transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Bountiful, always project-ing
            </span>
            <span className="inline-block rotate-[-1.5deg] border-[3px] border-current px-3.5 py-1.5 font-condensed text-2xl font-bold uppercase tracking-wide text-ink-blue transition-transform duration-150 ease-out hover:rotate-0 hover:scale-105 max-bp:text-base">
              Scope-sensitive, econ-brained
            </span>
            <span className="font-display text-4xl leading-none text-ink-pink misreg-blue max-bp:text-2xl">✦</span>
          </div>
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section className="pb-20 pt-8">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">05</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
              Frequently Asked
            </h2>
          </div>

          <div className="mt-9 border-t-8 border-ink-dark">
            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:text-5xl">Q1</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Why does Surplus encourage for-profit corps?
                </h3>
                <div className="columns-2 gap-8 font-serif text-lg leading-relaxed [column-rule:1.5px_solid_rgba(20,21,43,0.3)] [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:columns-1 max-bp:text-base">
                  <p>
                    First, there are many standard reasons to use a for-profit corporation when
                    trying to do good. For-profits operate with <b>tight feedback loops</b>. They
                    can be more certain that they produce value (see: gains from trade,{" "}
                    <a href="https://paulgraham.com/wealth.html">Paul Graham on wealth</a>,
                    &ldquo;surplus&rdquo;). They can tap into a much larger pool of available
                    financing. They compensate founders and employees with high upside upon a
                    successful exit, and thereby draw in better talent.
                  </p>
                  <p>
                    For-profit models are surprisingly flexible:{" "}
                    <a href="https://elicit.com/">Elicit</a>,{" "}
                    <a href="https://www.apolloresearch.ai/">Apollo</a>,{" "}
                    <a href="https://www.goodfire.ai/">Goodfire</a>,{" "}
                    <a href="https://www.wave.com/en/">Wave</a>,{" "}
                    <a href="https://www.dwarkesh.com/">Dwarkesh</a>,{" "}
                    <a href="https://lighthaven.space/">Lighthaven</a> and{" "}
                    <a href="https://manifest.is/">Manifest</a> all demonstrate different
                    approaches to making money while also serving the public interest.
                  </p>
                  <p>
                    Now is an excellent time to start a for-profit, given{" "}
                    <a href="https://nanransohoff.substack.com/p/the-third-wave-of-american-philanthropy">
                      vast torrents of funding
                    </a>{" "}
                    available from Anthropic employees and OpenAI Foundation. These funds are
                    distributed out of 501c3 entities — but 501c3s can pay for for-profit
                    services, and invest in for-profit corps. There&rsquo;s a $100B market waiting
                    to be constructed; <em>shovels waiting to be sold.</em>
                  </p>
                  <p>
                    And ideologically, we think that{" "}
                    <b>
                      equity is a beautiful mechanism for value alignment and credit allocation
                    </b>
                    . Manifund has previously experimented with{" "}
                    <a href="https://manifund.org/about/impact-certificates">
                      impact certificates
                    </a>{" "}
                    to bring this concept to the charity world; now, we think that plain ol&rsquo;
                    corporate equity will work fine, maybe with a light sprinkling of retroactive
                    funding or prize rounds or advance market commitments to finance public goods.
                  </p>
                </div>
              </div>
            </article>

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:text-5xl">Q2</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Why start a startup, rather than join a lab or an AI safety org?
                </h3>
                <div className="columns-2 gap-8 font-serif text-lg leading-relaxed [column-rule:1.5px_solid_rgba(20,21,43,0.3)] [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:columns-1 max-bp:text-base">
                  <p>
                    It is absolutely the case that Anthropic or METR are great places to work. But
                    maybe:
                  </p>
                  <p>
                    —&nbsp;You&rsquo;re well suited towards starting projects: you enjoy{" "}
                    <em>independence</em>, ship fast, update quickly and are willing to fail.
                  </p>
                  <p>
                    —&nbsp;You think that establishing new orgs is good for accountability and
                    avoiding groupthink, as a counterweight to frontier labs accumulating talent
                    and money.
                  </p>
                  <p>
                    —&nbsp;You have an idea that you <b>can&rsquo;t stop thinking about</b>,
                    something you think will be great for the world, something that nobody else is
                    doing (or worse: somebody is doing, but badly).
                  </p>
                </div>
              </div>
            </article>

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:text-5xl">Q3</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Why should I join an incubator, when vibecoding is so easy?
                </h3>
                <div className="columns-2 gap-8 font-serif text-lg leading-relaxed [column-rule:1.5px_solid_rgba(20,21,43,0.3)] [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:columns-1 max-bp:text-base">
                  <p>
                    Building great software takes <em>more than coding</em>.{" "}
                    <b>Product taste, visual design, distribution, sales and marketing</b> are all
                    things that 2026 LLMs still fail at. We&rsquo;ve developed these supplementary
                    skills needed to ship successful products, and would love to foster them in a
                    new generation of founders.
                  </p>
                  <p>
                    Beyond advice &amp; mentorship, Surplus also provides a{" "}
                    <b>cohort of folks working on similar problems</b>, some of whom may be great
                    cofounders. And finally, an incubator is a <em>container for focus</em>, a
                    commitment device, a way to hold yourself accountable and get your idea out
                    into the world.
                  </p>
                </div>
              </div>
            </article>

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:text-5xl">Q4</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Do you accept non-software startups?
                </h3>
                <div className="font-serif text-lg leading-relaxed [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:text-base">
                  <p>
                    Maybe? We have the most experience on startups with a major software
                    component, but have also built things like{" "}
                    <a href="https://manifest.is/">Manifest</a> and Mox.{" "}
                    <em>Apply if you wish!</em>
                  </p>
                </div>
              </div>
            </article>

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:text-5xl">Q5</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Is Surplus open to students?
                </h3>
                <div className="font-serif text-lg leading-relaxed [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:text-base">
                  <p>
                    Yes! If accepted to Surplus, we do ask that students plan to take a leave of
                    absence in the fall, or otherwise prepare so you can work on your startup{" "}
                    <em>without distractions</em>.
                  </p>
                </div>
              </div>
            </article>

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:text-5xl">Q6</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Can Surplus provide visas for international founders?
                </h3>
                <div className="font-serif text-lg leading-relaxed [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:text-base">
                  <p>
                    Yes! We can support accepted founders on a J-1 visa, through Mox. See{" "}
                    <a href="https://www.notion.so/Researchers-and-Founders-Join-Mox-s-J-1-Global-Expert-Fellowship-30d54492ea7a80bc9c5ce70ccfceae07?pvs=21">
                      Mox&rsquo;s J-1 Global Expert Fellowship
                    </a>
                    .
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section className="relative overflow-hidden bg-ink-dark pb-[60px] pt-20 text-paper max-bp:pb-12 max-bp:pt-14" id="apply">
        <span
          aria-hidden="true"
          className="halftone pointer-events-none absolute -right-[100px] -top-[100px] h-[500px] w-[500px] opacity-50 [--dot-gap:14px] [--dot:3px]"
        ></span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[150px] -left-[120px] h-[420px] w-[420px] rounded-full bg-ink-blue opacity-40 mix-blend-screen"
        ></span>
        <div className="relative z-[1] mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <h2 className="font-display text-[clamp(64px,8.5vw,128px)] leading-[0.82] tracking-[-0.04em]">
            <span className="text-ink-yellow">CODE</span> FOR MASSIVE
            <br />
            <span className="text-ink-pink">PUBLIC GOOD</span>
          </h2>
          <div className="mt-[30px] grid grid-cols-[1fr_auto] items-end gap-10 border-t-[3px] border-paper pt-[30px] max-bp:grid-cols-1 max-bp:gap-6">
            <p className="max-w-[40ch] font-serif text-xl leading-snug max-bp:text-lg">
              Seed funding, advice, peers, intros, and space to focus — 3 months, starting late
              July in SF.
            </p>
            <a
              className="inline-flex items-center gap-3.5 border-[3px] border-paper bg-ink-pink px-[30px] py-[22px] font-condensed text-3xl font-bold uppercase tracking-wide text-paper no-underline shadow-[8px_8px_0_var(--color-ink-blue)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[11px_11px_0_var(--color-ink-blue)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_var(--color-ink-blue)] max-bp:px-[22px] max-bp:py-4 max-bp:text-xl"
              href="/apply"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-display text-3xl">☞</span>
              <span>
                Apply by July 10
                <span className="block font-mono text-sm font-normal normal-case tracking-widest opacity-80">
                  Final deadline · rolling decisions
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* =================== COLOPHON =================== */}
      <footer className="bg-ink-dark pb-7 pt-5 font-mono text-[13px] uppercase tracking-[0.14em] text-paper">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-[1.5px] border-dotted border-paper/40 pt-4 max-bp:flex-col max-bp:items-start max-bp:gap-2">
            <span className="font-display text-lg tracking-[0.06em] text-paper">SURPLUS - 2026</span>
            <span>
              Organized by Austin of <b className="text-ink-yellow">Manifund</b> &amp; <b className="text-ink-yellow">Mox</b>
            </span>
            <span>
              Designed in San Francisco
            </span>
            <span>With <span className="text-ink-pink">love </span>for all</span>
          </div>
        </div>
      </footer>
    </>
  );
}
