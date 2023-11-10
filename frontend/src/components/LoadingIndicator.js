export default function LoadingIndicator() {
  return (
    <div className="m-auto w-fit text-3xl">
      <div className="h-8 w-8 animate-spin rounded-full border border-primary/70 bg-base-100">
        <div className="relative left-1 top-1 h-3 w-3 rounded-full bg-primary opacity-100"></div>
      </div>
    </div>
  );
}
