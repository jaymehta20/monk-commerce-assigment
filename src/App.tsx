import ProductList from './components/ProductList';
import Logo from '../public/logo.svg';

const App = () => {
  return (
    <div className="container mx-auto my-10 space-y-10">
      <h1 className="text-2xl font-bold inline-flex items-center gap-2">
        <img src={Logo} alt="Monk Commerce" className="size-10" />
        Monk Commerce
      </h1>
      <ProductList />
    </div>
  );
};

export default App;
