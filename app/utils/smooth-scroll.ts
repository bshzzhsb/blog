interface JumpOptions {
  duration: number | ((duration: number) => number);
  offset: number;
  callback?: () => void;
}

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

export function jump(targetHash: string | number, options: JumpOptions) {
  const start = window.scrollY;
  let distance: number;
  if (typeof targetHash === 'string') {
    const target = document.querySelector(decodeURI(targetHash)) || document.querySelector(targetHash);
    distance =
      options.offset + (target ? target.getBoundingClientRect().top || 0 : -document.documentElement.scrollTop);
  } else {
    distance = targetHash - start;
  }
  const duration = typeof options.duration === 'function' ? options.duration(distance) : options.duration;
  let timeStart: number;
  let timeElapsed: number;

  const end = () => {
    window.scrollTo(0, start + distance);
    options.callback?.();
  };

  const loop = (time: number) => {
    timeElapsed = time - timeStart;
    window.scrollTo(0, easeInOutQuad(timeElapsed, start, distance, duration));

    if (timeElapsed < duration) {
      requestAnimationFrame(loop);
    } else {
      end();
    }
  };

  requestAnimationFrame(function (time) {
    timeStart = time;
    loop(time);
  });
}

function delegatedLinkHijacking(options: Pick<JumpOptions, 'duration' | 'offset'>) {
  const stripHash = (url: string) => {
    return url.slice(0, url.lastIndexOf('#'));
  };
  const pageUrl = location.hash ? stripHash(location.href) : location.href;

  const isInPageLink = (element: HTMLElement) => {
    if (element instanceof HTMLAnchorElement) {
      return element.tagName.toLowerCase() === 'a' && element.hash.length > 0 && stripHash(element.href) === pageUrl;
    }
    return false;
  };

  const setFocus = (hash: string) => {
    const element = document.getElementById(decodeURI(hash.slice(1))) || document.getElementById(hash.slice(1));
    if (element) {
      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
        element.tabIndex = -1;
      }
      element.focus();
    }
  };

  const handleClick = (e: MouseEvent) => {
    const el = e.target;
    if (el instanceof Element) {
      if (isInPageLink(el as HTMLElement) && (el as Element).className.indexOf('no-smooth-scroll') === -1) {
        jump((el as HTMLAnchorElement).hash, {
          ...options,
          callback: function () {
            setFocus((el as HTMLAnchorElement).hash);
          },
        });
      }
    }
  };
  document.body.addEventListener('click', handleClick, false);

  return () => {
    document.body.removeEventListener('click', handleClick, false);
  };
}

export function smoothScroll(options: Pick<JumpOptions, 'duration' | 'offset'>) {
  return delegatedLinkHijacking(options);
}
