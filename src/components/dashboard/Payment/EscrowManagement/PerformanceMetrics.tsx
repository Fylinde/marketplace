import { useDispatch, useSelector } from "react-redux";

const PerformanceMetrics = () => {
    const { metrics, loading } = useSelector((state: any) => state.escrow);
  
    if (loading) return <p>Loading performance metrics...</p>;
  
    return (
      <div>
        <h3>Performance Metrics</h3>
        <p>Average Release Time: {metrics.averageReleaseTime} hours</p>
        <p>Average Resolution Time: {metrics.averageResolutionTime} days</p>
      </div>
    );
  };
  
  export default PerformanceMetrics;
  