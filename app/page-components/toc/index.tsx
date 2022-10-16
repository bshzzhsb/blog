import { useEffect, useRef } from 'react';

import slugify from '~/utils/slugify';
import debounce from '~/utils/debounce';
import { smoothScroll } from '~/utils/smooth-scroll';

export interface TOCProps {
  className: string;
  headings: {
    text: string;
    level: 1 | 2 | 3;
  }[];
}

const TOC: React.FC<TOCProps> = ({ className, headings }) => {
  const tocRefs = useRef<HTMLAnchorElement[]>([]);
  const tocContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // inject smooth scroll for Anchor
    const dispose = smoothScroll({
      duration: (distance: number) => (Math.abs(distance) < 500 ? Math.abs(distance) : 500),
      offset: -96,
    });
    return () => {
      dispose();
    };
  }, []);

  useEffect(() => {
    const toc = tocRefs.current;
    const tocContainerHeight = tocContainerRef.current?.offsetHeight;

    // auto scroll to the active toc
    const focusActiveToc = debounce((index: number) => {
      const activeToc = toc[index];
      if (activeToc && typeof tocContainerHeight !== 'undefined') {
        const activeTocScrollHeight = activeToc.offsetTop;
        tocContainerRef.current?.scrollTo(0, activeTocScrollHeight - tocContainerHeight / 3);
      }
    }, 20);

    const handleScroll = () => {
      if (toc.length === 0 || headings.length === 0) return;
      // reset active toc
      toc.forEach(toc => {
        toc.classList.remove('active');
      });

      const top = document.documentElement.scrollTop;

      // if toc-0 is active
      const h0 = document.getElementById(slugify(headings[0].text));
      if (h0 && top + 96 <= h0.offsetTop) {
        toc[0].classList.add('active');
        focusActiveToc(0);
        return;
      }

      // if 2...len-1 is active
      for (let i = 0; i < toc.length - 1; i++) {
        const h = document.getElementById(slugify(headings[i].text));
        const nextH = document.getElementById(slugify(headings[i + 1].text));
        if (h && nextH && top + 96 >= h.offsetTop && top + 96 < nextH.offsetTop) {
          toc[i].classList.add('active');
          focusActiveToc(i);
          return;
        }
      }
      // or the last toc is active
      toc[toc.length - 1].classList.add('active');
      focusActiveToc(toc.length - 1);
    };

    // initialize active toc
    handleScroll();
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  return (
    <div ref={tocContainerRef} className={className + ' overflow-y-auto scrollbar toc'}>
      <h3 className="font-semibold tracking-widest">TOC</h3>
      <nav>
        {headings.map(({ text, level }, i) => (
          <a
            key={text}
            ref={ref => {
              if (ref) tocRefs.current[i] = ref;
            }}
            className={
              (level === 2 ? 'mt-1 ml-4 text-sm' : level === 3 ? 'mt-1 ml-8 text-sm' : 'mt-2') +
              ' block text-secondary hover:text-primary'
            }
            href={`#${slugify(text)}`}
          >
            {text}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default TOC;
