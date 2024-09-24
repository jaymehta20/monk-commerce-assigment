import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Laptop, Moon, Sun } from 'lucide-react';
import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Logo from '/logo.svg';
import ProductList from './components/ProductList';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.075 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-md flex items-center border"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              transition={{ duration: 0.2 }}
              className="mr-2"
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : theme === 'light' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Laptop className="w-5 h-5" />
              )}
            </motion.div>
          </AnimatePresence>
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const App = () => {
  return (
    <ThemeProvider attribute="class">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto my-10 px-4 sm:px-6 lg:px-8"
      >
        <header className="flex justify-between items-center mb-10">
          <motion.h1
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-2xl font-medium inline-flex items-center gap-2"
          >
            <img src={Logo} alt="Monk Commerce" className="size-8 rounded-md" />
            <span className="text-zinc-500">Monk Upsell & Cross-sell</span>
          </motion.h1>
          <ThemeToggle />
        </header>
        <ProductList />
      </motion.div>
    </ThemeProvider>
  );
};

export default App;
