const Web3 = require('web3');
const MilletTraceContract = require('../client/src/contracts/MilletTrace.json');

class BlockchainService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.contractAddress = null;
  }

  async initialize() {
    try {
      // Connect to local Ganache or Ethereum network
      this.web3 = new Web3('http://127.0.0.1:7545');
      
      // Get accounts
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];
      
      // Contract address (update after deployment)
      this.contractAddress = '0x1234567890123456789012345678901234567890'; // Update this
      
      // Initialize contract
      this.contract = new this.web3.eth.Contract(
        MilletTraceContract.abi,
        this.contractAddress
      );
      
      console.log('Blockchain service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      return false;
    }
  }

  async createMilletBatch(batchData) {
    try {
      const {
        batchId,
        farmerId,
        milletType,
        variety,
        harvestDate,
        qualityGrade,
        organicCertified
      } = batchData;

      const result = await this.contract.methods
        .createMilletBatch(
          batchId,
          farmerId,
          milletType,
          variety,
          harvestDate,
          qualityGrade,
          organicCertified
        )
        .send({ from: this.account });

      return {
        success: true,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      };
    } catch (error) {
      console.error('Error creating millet batch:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addTraceabilityRecord(batchId, traceData) {
    try {
      const {
        stage,
        location,
        operator,
        notes,
        certificateHash
      } = traceData;

      const result = await this.contract.methods
        .addTraceabilityRecord(
          batchId,
          stage,
          location,
          operator,
          notes,
          certificateHash
        )
        .send({ from: this.account });

      return {
        success: true,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      };
    } catch (error) {
      console.error('Error adding traceability record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBatchInfo(batchId) {
    try {
      const result = await this.contract.methods
        .getBatchInfo(batchId)
        .call();

      return {
        success: true,
        data: {
          batchId: result[0],
          farmerId: result[1],
          milletType: result[2],
          variety: result[3],
          harvestDate: result[4],
          qualityGrade: result[5],
          organicCertified: result[6],
          owner: result[7],
          exists: result[8]
        }
      };
    } catch (error) {
      console.error('Error getting batch info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTraceabilityRecords(batchId) {
    try {
      const result = await this.contract.methods
        .getTraceabilityRecords(batchId)
        .call();

      const records = [];
      const length = result[0].length;

      for (let i = 0; i < length; i++) {
        records.push({
          stage: result[0][i],
          location: result[1][i],
          timestamp: result[2][i],
          operator: result[3][i],
          notes: result[4][i],
          certificateHash: result[5][i],
          verified: result[6][i]
        });
      }

      return {
        success: true,
        data: records
      };
    } catch (error) {
      console.error('Error getting traceability records:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyBatch(batchId, verified) {
    try {
      const result = await this.contract.methods
        .verifyBatch(batchId, verified)
        .send({ from: this.account });

      return {
        success: true,
        transactionHash: result.transactionHash
      };
    } catch (error) {
      console.error('Error verifying batch:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTotalBatches() {
    try {
      const total = await this.contract.methods
        .getTotalBatches()
        .call();

      return {
        success: true,
        total: parseInt(total)
      };
    } catch (error) {
      console.error('Error getting total batches:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateBatchId() {
    return 'BATCH_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateCertificateHash(data) {
    return this.web3.utils.keccak256(JSON.stringify(data));
  }
}

module.exports = new BlockchainService();
