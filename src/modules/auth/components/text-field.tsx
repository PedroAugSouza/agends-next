interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  customInput?: React.JSX.Element;
  error?: string;
}

export const TextField = ({
  label,
  placeholder,
  customInput,
  type,
  error,
  ...rest
}: Props) => {
  return (
    <div className="flex w-full flex-col items-start gap-2.5 py-2.5">
      {label && <span className="text-sm text-gray-700">{label}</span>}

      {customInput ? (
        customInput
      ) : (
        <input
          type={type ? type : 'text'}
          {...rest}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-slate-400 bg-gray-50 px-2.5 shadow-md transition-all outline-none focus:border-slate-600"
        />
      )}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
