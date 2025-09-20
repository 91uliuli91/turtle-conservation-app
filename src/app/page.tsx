// src/app/page.tsx
import WizardForm from '@/components/WizardForm';
import ClientBodyWrapper from '@/components/ClientBodyWrapper';

export default function Home() {
  return (
    <ClientBodyWrapper>
      <WizardForm />
    </ClientBodyWrapper>
  );
}