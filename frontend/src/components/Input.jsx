import { motion } from "framer-motion";

const Input = ({ icon: Icon, ...props }) => {
	return (
		<motion.div 
			className='relative mb-6'
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-primary' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-base-200 border border-base-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition duration-200 text-base-content placeholder-base-content/60'
			/>
		</motion.div>
	);
};
export default Input;
