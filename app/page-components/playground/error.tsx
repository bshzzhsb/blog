export type ErrorType = { name: string; message: string };

interface ErrorProps {
  error: ErrorType;
}

const Error: React.FC<ErrorProps> = ({ error }) => (
  <div className="absolute inset-0 bg-white/90">
    <div className="p-6 m-8 shadow-lg rounded-xl bg-white">
      <div className="mb-2 text-red-500 whitespace-pre text-xl">{error.name}</div>
      <p className="text-black/70">{error.message}</p>
    </div>
  </div>
);

export default Error;
