import React from "react";
import { CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";

interface BlockchainVerificationProps {
  blockchainStatus?: string;
  blockchainTransactionHash?: string;
  blockchainHash?: string;
  blockchainVerificationTime?: string;
}

export const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({
  blockchainStatus = "pending",
  blockchainTransactionHash,
  blockchainHash,
  blockchainVerificationTime,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "recorded":
        return "text-green-600";
      case "verified":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "recorded":
      case "verified":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "failed":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getBlockchainLink = (hash: string) => {
    return `https://mumbai.polygonscan.com/tx/${hash}`;
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-gray-800">Blockchain Verification</h3>
      </div>

      {/* Status */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`${getStatusColor(blockchainStatus)}`}>
          {getStatusIcon(blockchainStatus)}
        </span>
        <span className="text-sm font-medium text-gray-700">
          Status: <span className="capitalize">{blockchainStatus}</span>
        </span>
      </div>

      {/* Transaction Hash */}
      {blockchainTransactionHash && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Transaction Hash:</p>
          <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-300">
            <code className="text-xs text-gray-700 flex-1 truncate">
              {blockchainTransactionHash}
            </code>
            <a
              href={getBlockchainLink(blockchainTransactionHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex-shrink-0"
              title="View on Polygon Mumbai Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Offer Hash */}
      {blockchainHash && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Offer Hash (SHA256):</p>
          <div className="bg-white p-2 rounded border border-gray-300">
            <code className="text-xs text-gray-700 break-all">
              {blockchainHash}
            </code>
          </div>
        </div>
      )}

      {/* Verification Time */}
      {blockchainVerificationTime && (
        <div className="text-xs text-gray-600">
          Verified at: {new Date(blockchainVerificationTime).toLocaleString()}
        </div>
      )}

      {/* Info Message */}
      {blockchainStatus === "pending" && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ℹ️ Blockchain recording in progress...
        </div>
      )}

      {blockchainStatus === "recorded" && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
          ✅ This offer has been recorded on Polygon Mumbai testnet for transparency and immutability.
        </div>
      )}

      {blockchainStatus === "failed" && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
          ⚠️ Blockchain recording encountered an issue, but your offer is still valid.
        </div>
      )}

      {/* Network Info */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          🔗 Network: <span className="font-medium">Polygon Mumbai Testnet</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          This is for demonstration purposes. The offer is stored both in our database and on the blockchain for verification.
        </p>
      </div>
    </div>
  );
};

export default BlockchainVerification;
