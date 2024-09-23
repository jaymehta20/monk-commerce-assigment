import ProductList from './components/ProductList';

const App = () => {
  return (
    <div className="container mx-auto my-10 space-y-10">
      <h1 className="text-2xl font-bold">Monk Commerce</h1>
      <ProductList />
    </div>
  );
};

export default App;
