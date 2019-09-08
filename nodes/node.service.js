const db = require('../helpers/db');
const Node = db.Node;

module.exports = {
    getNodes,
    create,
    update,
    deleteNode
};

async function getNodes(modelID) {
    return await Node.find({ modelID });
}


// register a user in the database
async function create(nodeParams) {
    // first check if the node name is already in use 
    // if so throw an error if not proceed
    let existingNode = await Node.findOne({ modelID: nodeParams.modelID, 'number': nodeParams.number });
    // check for existing nodes
    if (existingNode) throw Error(('Sorry but a node exists with this number'));

    // create a new node
    const node = new Node(nodeParams);
    // save node
    await node.save();
}

// update a record in the database
async function update(nodeParams) {
    let existingNode = await Node.findOne({ modelID: nodeParams.modelID, 'number': nodeParams.number });
    // validate
    if (!existingNode) throw Error('Node not found');

    node = Object.assign(existingNode, nodeParams);
    await node.save();
}


// find a node by modelID and number and then delete it
async function deleteNode(modelID, number) {
    // then delete the actual user record
    await User.deleteOne({ modelID, number });
}