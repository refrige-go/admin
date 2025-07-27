export default function ChevronDown({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"  // fill 색을 CSS로 제어 가능하게
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 15L7 10H17L12 15Z" />
    </svg>
  );
}