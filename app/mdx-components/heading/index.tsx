import React from 'react';

import slugify from '~/utils/slugify';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  children: React.ReactNode;
  id: string;
  level: HeadingLevel;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ id, level, className, children }) => {
  const heading = `h${level}`;
  return React.createElement(heading, { id, className }, children);
};

export default Heading;

export function getHeading(level: HeadingLevel) {
  const className =
    level === 1
      ? 'mt-12 mb-4 heading text-3xl font-semibold'
      : level === 2
      ? 'mt-12 mb-3 heading text-2xl font-semibold'
      : level === 3
      ? 'my-12 mb-3 heading text-xl font-semibold'
      : 'mt-6 mb-2 heading font-medium';
  return ({ children }: { children: React.ReactNode }) => {
    const anchorId = slugify(children as string);

    return (
      <Heading id={anchorId} level={level} className={className + ' relative group'}>
        <a
          href={`#${anchorId}`}
          className="absolute left-0 -translate-x-[2em] px-4 opacity-0 group-hover:opacity-100 transition"
        >
          #
        </a>
        {children}
      </Heading>
    );
  };
}
