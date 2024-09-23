import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
const AddProductButton = ({
  setShowProductModal,
}: {
  setShowProductModal: (value: boolean) => void;
}) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={() => setShowProductModal(true)}
        variant="outline"
        className="border-2 border-[#008060] text-[#008060] hover:bg-[#e6f3f0] hover:text-[#00533f] dark:border-[#00a67d] dark:text-[#00a67d] dark:hover:bg-[#004d3d] dark:hover:text-[#00c795] rounded-md px-2 sm:px-20 py-2 text-sm font-medium transition-colors duration-200"
      >
        Add Product
      </Button>
    </motion.div>
  );
};

export default AddProductButton;
