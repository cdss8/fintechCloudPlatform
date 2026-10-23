const Express = require('express')
const Cors = require('cors')
const transID = require('node:crypto')


const app = Express()
const PORT = 3000


app.use(Cors())
app.use(Express.json())


app.get('/', (_req, res) => {
    res.send('Welcome to the simple transacctional API')
})


//Endpoint for k8s
app.get('/secure3ds', (_req, res) => {
    res.status(200).json({ status:"TransactionIsSecure", timestamp: new Date })
})


//Transaction Simulation
app.post('/transaction',(_req, res)=>{
    const { F12_ID, IBAN, amount, currency } = res.body;

    const riskScore = Math.floor(Math.random()*100)
    const isFraudulent = riskScore > 80;

    res.json({
        transactionID: `SWIFTXXXBANK_${transID()}`,
        accountID: F12_ID || 'NO REGISTERED IN THE SYSTEM',
        account: IBAN,
        amount,
        currency: currency || 'USD',
        riskPoint: riskScore,
        status:isFraudulent,
        timeProcessed: new Date()
    })
})



app.listen(PORT, ()=>{
   console.log('server running propoerly in port ' + PORT)
})