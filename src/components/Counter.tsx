import useStore from '../store/useStore';
import { Button } from './ui/button';

const Counter = () => {
  const { count, increaseCount, decreaseCount } = useStore();

  return (
    <div>
      <h1>{count}</h1>
      <Button onClick={increaseCount}>Increase</Button>
      <Button onClick={decreaseCount}>Decrease</Button>
    </div>
  );
};

export default Counter;
