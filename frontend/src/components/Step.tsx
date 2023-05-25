interface StepProps {
  step: string;
}

const Step = ({ step }: StepProps) => {
  return (
    <div className="relative h-16 w-16 overflow-hidden p-1">
      <span className="absolute -top-2 -z-10 h-12 w-12 rounded-full bg-cyan-700 opacity-60 blur-md" />
      <span className="absolute -left-4  top-8 -z-10 h-12 w-12 rounded-full bg-pink-700  opacity-60 blur-md" />
      <span className="absolute -right-4 top-2 -z-10 h-12 w-12 rounded-full bg-purple-800 opacity-60 blur-md" />
      <p className="flex h-full w-full items-center justify-center bg-neutral-900 text-3xl font-bold">
        {step}
      </p>
    </div>
  );
};

export default Step;
