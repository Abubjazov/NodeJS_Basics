const http = require('http')

const server = http.createServer((req, res) => {
    console.log(req.url)

    res.write('<h1>Hello from Node.js</h1>')
    res.write('<h2>Hello from Node.js</h2>')
    res.write('<h3>Hello from Node.js</h3>')
    res.end(`
        <div style="background: red; width: 300px; height: 300px;">
            <h1>Test 2 Node.js</h1>
        </div>
    `)
})

server.listen(3000, () => {
    console.log('Server is running...')
})
