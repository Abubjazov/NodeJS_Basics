const fs = require('fs')
const path = require('path')

// fs.mkdir(path.join(__dirname, 'notes'), err => {
//     if (err.code === 'EEXIST') throw err

//     console.log('Folder was created')
// })

// fs.writeFile(
//     path.join(__dirname, 'notes', 'myNotes.txt'),
//     'Hello world!!!',
//     err => {
//         if (err) throw err
//         console.log('File was created')
//     }
// )

// fs.appendFile(
//     path.join(__dirname, 'notes', 'myNotes.txt'),
//     '\n\nPrived Medved!!!',
//     err => {
//         if (err) throw err
//         console.log('File was updated')

//         fs.readFile(
//             path.join(__dirname, 'notes', 'myNotes.txt'),
//             'utf-8',
//             (err, data) => {
//                 if (err) throw err
//                 console.log('File contents: ', data) //Buffer.from(data).toString()
//             }
//         )
//     }
// )

fs.rename(
    path.join(__dirname, 'notes', 'myNotes.txt'),
    path.join(__dirname, 'notes', 'notes.js'),
    err => {
        if (err) throw err

        console.log('File was renamed')
    }
)
