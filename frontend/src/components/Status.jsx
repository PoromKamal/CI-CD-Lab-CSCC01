import React, {useState, useEffect} from "react";
import { FaServer, FaDatabase, FaMemory } from 'react-icons/fa';
import config from "../config/config";
function Status() {
  const [serverStatus, setServerStatus] = useState({server: false, database: false, cache: false});
  
  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch(config.serverUrl + '/api/health');
      const data = await response.json();
      setServerStatus(data);
    }
    fetchStatus();
  }, []);
  const statusColor = (status) => (status ? 'bg-green-500' : 'bg-red-500');
  return (
    <div class = "flex flex-col">
      <div className="text-4xl font-bold w-full text-center mt-10">
        Service Status
      </div>
      <div className="flex gap-5 p-5 justify-center">
        <div className="w-1/6 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex items-center gap-3">
            <FaServer className="text-2xl" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Server</h3>
            </div>
            <div className={`w-4 h-4 rounded-full ${statusColor(serverStatus.server)}`}></div>
          </div>
        </div>
        
        <div className="w-1/6 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex items-center gap-3">
            <FaDatabase className="text-2xl" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Database</h3>
            </div>
            <div className={`w-4 h-4 rounded-full ${statusColor(serverStatus.database)}`}></div>
          </div>
        </div>

        <div className="w-1/6 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex items-center gap-3">
            <FaMemory className="text-2xl" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Cache</h3>
            </div>
            <div className={`w-4 h-4 rounded-full ${statusColor(serverStatus.cache)}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Status;
