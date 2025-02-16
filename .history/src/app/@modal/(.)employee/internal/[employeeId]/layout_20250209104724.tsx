// app/employees/internal/[id]/layout.tsx
export default function Layout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}