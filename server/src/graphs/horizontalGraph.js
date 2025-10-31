// Example: Fetching data from backend
// example of a backend file using backend data to fetch from the frontend
// horizontalGraph.d.ts

/*
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT');
      const data = await response.json();
      
      // Update chart with new data
      if (chartInstanceRef.current) {
        chartInstanceRef.current.data.labels = data.labels; // ['Game 1', 'Game 2', ...]
        chartInstanceRef.current.data.datasets[0].data = data.values; // [45, 60, 75, ...]
        chartInstanceRef.current.update();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

*/