// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MilletTrace {
    struct TraceabilityRecord {
        string stage;
        string location;
        uint256 timestamp;
        string operator;
        string notes;
        string certificateHash;
        bool isVerified;
    }
    
    struct MilletBatch {
        string batchId;
        string farmerId;
        string milletType;
        string variety;
        uint256 harvestDate;
        string qualityGrade;
        bool organicCertified;
        address owner;
        bool exists;
    }
    
    mapping(string => MilletBatch) public milletBatches;
    mapping(string => TraceabilityRecord[]) public batchTraceability;
    mapping(address => bool) public authorizedOperators;
    
    address public owner;
    uint256 public totalBatches;
    
    event BatchCreated(string indexed batchId, string farmerId, string milletType);
    event TraceabilityAdded(string indexed batchId, string stage, uint256 timestamp);
    event BatchVerified(string indexed batchId, bool verified);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedOperators[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedOperators[msg.sender] = true;
    }
    
    function addAuthorizedOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = true;
    }
    
    function removeAuthorizedOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = false;
    }
    
    function createMilletBatch(
        string memory _batchId,
        string memory _farmerId,
        string memory _milletType,
        string memory _variety,
        uint256 _harvestDate,
        string memory _qualityGrade,
        bool _organicCertified
    ) external onlyAuthorized {
        require(!milletBatches[_batchId].exists, "Batch already exists");
        
        milletBatches[_batchId] = MilletBatch({
            batchId: _batchId,
            farmerId: _farmerId,
            milletType: _milletType,
            variety: _variety,
            harvestDate: _harvestDate,
            qualityGrade: _qualityGrade,
            organicCertified: _organicCertified,
            owner: msg.sender,
            exists: true
        });
        
        totalBatches++;
        
        // Add initial traceability record
        addTraceabilityRecord(
            _batchId,
            "harvesting",
            "Farm Location",
            "Farmer",
            "Initial harvest recorded",
            ""
        );
        
        emit BatchCreated(_batchId, _farmerId, _milletType);
    }
    
    function addTraceabilityRecord(
        string memory _batchId,
        string memory _stage,
        string memory _location,
        string memory _operator,
        string memory _notes,
        string memory _certificateHash
    ) public onlyAuthorized {
        require(milletBatches[_batchId].exists, "Batch does not exist");
        
        TraceabilityRecord memory record = TraceabilityRecord({
            stage: _stage,
            location: _location,
            timestamp: block.timestamp,
            operator: _operator,
            notes: _notes,
            certificateHash: _certificateHash,
            isVerified: true
        });
        
        batchTraceability[_batchId].push(record);
        
        emit TraceabilityAdded(_batchId, _stage, block.timestamp);
    }
    
    function verifyBatch(string memory _batchId, bool _verified) external onlyOwner {
        require(milletBatches[_batchId].exists, "Batch does not exist");
        
        // Mark all traceability records as verified
        TraceabilityRecord[] storage records = batchTraceability[_batchId];
        for (uint i = 0; i < records.length; i++) {
            records[i].isVerified = _verified;
        }
        
        emit BatchVerified(_batchId, _verified);
    }
    
    function getBatchInfo(string memory _batchId) external view returns (
        string memory batchId,
        string memory farmerId,
        string memory milletType,
        string memory variety,
        uint256 harvestDate,
        string memory qualityGrade,
        bool organicCertified,
        address owner,
        bool exists
    ) {
        MilletBatch memory batch = milletBatches[_batchId];
        return (
            batch.batchId,
            batch.farmerId,
            batch.milletType,
            batch.variety,
            batch.harvestDate,
            batch.qualityGrade,
            batch.organicCertified,
            batch.owner,
            batch.exists
        );
    }
    
    function getTraceabilityRecords(string memory _batchId) external view returns (
        string[] memory stages,
        string[] memory locations,
        uint256[] memory timestamps,
        string[] memory operators,
        string[] memory notes,
        string[] memory certificateHashes,
        bool[] memory verified
    ) {
        TraceabilityRecord[] memory records = batchTraceability[_batchId];
        uint256 length = records.length;
        
        stages = new string[](length);
        locations = new string[](length);
        timestamps = new uint256[](length);
        operators = new string[](length);
        notes = new string[](length);
        certificateHashes = new string[](length);
        verified = new bool[](length);
        
        for (uint i = 0; i < length; i++) {
            stages[i] = records[i].stage;
            locations[i] = records[i].location;
            timestamps[i] = records[i].timestamp;
            operators[i] = records[i].operator;
            notes[i] = records[i].notes;
            certificateHashes[i] = records[i].certificateHash;
            verified[i] = records[i].isVerified;
        }
    }
    
    function getTotalBatches() external view returns (uint256) {
        return totalBatches;
    }
}
