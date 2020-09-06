import { useEffect } from 'react';

const useObservable = (observable, callback) => {
  useEffect(() => {
    let subscription = observable.subscribe(callback);
    return () => subscription.unsubscribe();
  }, [observable, callback]);
};

export default useObservable;
