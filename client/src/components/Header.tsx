import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import ModeToggle from './ui/ModeToggle';

interface HeaderProps {
  onAddSession: () => void;
}

export const Header = ({ onAddSession }: HeaderProps) => {

  return (
    <header className="bg-white/10 dark:bg-zinc-900/10 sticky top-0 z-10 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Study Planner</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Track your study sessions and progress
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onAddSession}
            size="default"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Session</span>
            <span className="sm:hidden">Add</span>
          </Button>
          
          {/* <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button> */}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
};