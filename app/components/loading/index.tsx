import { Icon } from '../icon';

export function Loading() {
  return (
    <div className="absolute flex justify-center items-center w-full h-full bg-white z-10">
      <Icon name="loading" className="w-12 h-12 animate-spin ease-in-out" />
    </div>
  );
}
