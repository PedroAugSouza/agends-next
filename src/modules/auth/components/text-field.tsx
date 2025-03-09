interface Props {
  label?: string;
  placeholder?: string;
  customInput?: React.JSX.Element;
}

export const TextField = ({ label, placeholder, customInput }: Props) => {
  return (
    <div className="flex w-full flex-col items-start gap-2.5 py-2.5">
      {label && <span className="text-sm text-gray-700">{label}</span>}

      {customInput ? (
        customInput
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-slate-400 bg-gray-50 px-2.5 shadow-md transition-all outline-none focus:border-slate-600"
        />
      )}
    </div>
  );
};
