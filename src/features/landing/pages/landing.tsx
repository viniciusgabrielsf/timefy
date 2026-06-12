import { Button } from '@components/button';
import { useNavigate } from 'react-router';
import { signUpPageRoutes } from '@features/auth/routes/sign-up';
import { Page } from '@/components/pages/page';
import { logInPageRoutes } from '@/features/auth/routes/log-in';
// TODO test buttons when they are functional
export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Page>
      {/* TODO extract this logo -> title to <LogoTitle /> shared component */}
      <div className="flex items-center gap-4">
        <img src="public/assets/logo2.png" alt="Lâmpada mágica" className="w-30 h-30 sm:w-50 sm:h-50" />
        <h1 className="text-6xl sm:text-8xl font-bold">Timefy</h1>
      </div>

      <p className="text-4xl sm:text-6xl font-bold">Menos procrastinação. Mais produtividade.</p>

      <p className="max-w-5xl text-xl sm:text-2xl italic text-muted-foreground">
        Gerencie tarefas, mantenha o foco e alcance seus objetivos com ciclos inteligentes de trabalho e descanso.
      </p>

      <div className="flex items-center gap-4 py-10">
        <Button variant="secondary" size="xl" onClick={() => navigate(signUpPageRoutes.SIGN_UP)}>
          Cadastrar
        </Button>
        <Button size="xl" onClick={() => navigate(logInPageRoutes.LOG_IN)}>
          Entrar
        </Button>
      </div>
    </Page>
  );
};
