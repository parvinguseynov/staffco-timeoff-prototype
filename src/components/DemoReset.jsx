const DemoReset = ({ onReset }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg">
      <button
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
      >
        Reset Demo
      </button>
    </div>
  );
};

export default DemoReset;
