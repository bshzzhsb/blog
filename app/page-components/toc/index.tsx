import { memo, useEffect, useRef } from 'react';
import { TableOfContentData } from '@tiptap-pro/extension-table-of-contents';

import debounce from '~/utils/debounce';
import { smoothScroll } from '~/utils/smooth-scroll';

export interface TOCProps {
  className: string;
  toc: TableOfContentData;
}

const TOC: React.FC<TOCProps> = memo(({ className, toc }) => {
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
    const tocElements = tocRefs.current;
    const tocContainerHeight = tocContainerRef.current?.offsetHeight;

    // auto scroll to the active toc
    const focusActiveToc = debounce((index: number) => {
      const activeToc = tocElements[index];
      if (activeToc && typeof tocContainerHeight !== 'undefined') {
        const activeTocScrollHeight = activeToc.offsetTop;
        tocContainerRef.current?.scrollTo(0, activeTocScrollHeight - tocContainerHeight / 3);
      }
    }, 20);

    const handleScroll = () => {
      if (toc.length === 0 || tocElements.length === 0) return;
      // reset active toc
      tocElements.forEach(element => {
        element.classList.remove('active');
      });

      const top = document.documentElement.scrollTop;

      // if toc-0 is active
      const h0 = document.getElementById(toc[0].id);
      if (h0 && top + 96 <= h0.offsetTop) {
        tocElements[0].classList.add('active');
        focusActiveToc(0);
        return;
      }

      // if 2...len-1 is active
      for (let i = 0; i < toc.length - 1; i++) {
        const h = document.getElementById(toc[i].id);
        const nextH = document.getElementById(toc[i + 1].id);
        if (h && nextH && top + 96 >= h.offsetTop && top + 96 < nextH.offsetTop) {
          tocElements[i].classList.add('active');
          focusActiveToc(i);
          return;
        }
      }
      // or the last toc is active
      tocElements[toc.length - 1].classList.add('active');
      focusActiveToc(toc.length - 1);
    };

    // initialize active toc
    handleScroll();
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [toc]);

  return (
    <div ref={tocContainerRef} className={className + ' overflow-y-auto scrollbar toc'}>
      <h3 className="font-semibold tracking-widest">TOC</h3>
      <nav>
        {toc.map((item, i) => (
          <a
            key={item.id}
            ref={ref => {
              if (ref) tocRefs.current[i] = ref;
            }}
            className={
              (item.level === 2 ? 'mt-1 ml-4 text-sm' : item.level === 3 ? 'mt-1 ml-8 text-sm' : 'mt-2') +
              ' block text-secondary hover:text-primary'
            }
            href={`#${item.id}`}
          >
            {item.textContent}
          </a>
        ))}
      </nav>
    </div>
  );
});

export default TOC;
