const Express = require('express')
const Cors = require('cors')
const transID = require('node:crypto')
const pyServiceURL = process.env.PYTHON_SERVICE_URL

const app = Express()
const PORT = 3000

app.use(Cors())
app.use(Express.json())

app.get('/', (req, res) => {
    res.send('Welcome to the simple transacctional API')
})


//Endpoint for k8s
app.get('/secure3ds', (req, res) => {
    res.status(200).json({ status:"TransactionIsSecure", timestamp: new Date })
})


//Transaction Simulation
app.post('/api/transaction', async (req, res) => {
    try {
        const { customer, flexcubeID, IBAN, amount, currency } = req.body;

        const transaction = {
            customer,
            flexcubeID,
            IBAN,
            amount,
            currency: currency || 'USD'
        };

        // Ask the Python service to analyze the transaction
        const analysis = await analyzeTransaction(transaction);

    res.json({
        transactionID: `SWIFTXXXBANK_${transID.randomUUID()}`,
        customer,
        accountID: flexcubeID || 'NO REGISTERED IN THE SYSTEM',
        account: IBAN,
        amount,
        currency: currency || 'USD',
        riskPoint: analysis.risk_score,
        status: analysis.status,
        timeProcessed: new Date()
    });

    } catch (error) {
        console.error('Transaction analysis failed:', error.message);

        res.status(502).json({
            error: 'Could not analyze transaction',
            details: error.message
        });
    }
});

app.listen(PORT, ()=>{
   console.log('server running propoerly in port ' + PORT)
})


if (!process.env.PYTHON_SERVICE_URL) {
    console.warn('PYTHON_SERVICE_URL is not configured');
}
async function analyzeTransaction(transaction) {
    const response = await fetch(
        `${pyServiceURL}/api/v1/analyze`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transaction),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Python service returned ${response.status}`
        );
    }

    return await response.json();
}