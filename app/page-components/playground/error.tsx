export type ErrorType = { name?: string; message: string };

interface ErrorProps {
  error: ErrorType;
}

const Error: React.FC<ErrorProps> = ({ error: { name, message } }) => (
  <div className="absolute inset-0 bg-white/90">
    <div className="p-6 m-8 shadow-lg rounded-xl bg-white">
      {name && <div className="mb-2 text-red-500 whitespace-pre text-xl">{name}</div>}
      <p className="text-black/70">{message}</p>
    </div>
  </div>
);

export default Error;
