import { useEffect } from 'react';

const useObservable = (observable, callback) => {
  useEffect(() => {
    let subscription = observable.subscribe(callback);
    return () => subscription.unsubscribe();
  }, []);
};

export default useObservable;
