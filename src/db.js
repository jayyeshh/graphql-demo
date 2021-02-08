let users=[
    {
        id: '1',
        name: 'Andrew',
        email: 'andrew@mail.co',
    },
    {
        id: '2',
        name: 'Behance',
        email: 'behance@mail.it',
        age: 32,
    },
    {
        id: '3',
        name: 'felix',
        email: 'pewdiepie@gmail.com',
        age: 34,
    }
]

let comments=[
    {
        id: 'c101',
        text: 'comment1',
        author: '3',
        post: '101'
    },
    {
        id: 'c102',
        text: 'comment2',
        author: '3',
        post: '102'
    },
    {
        id: 'c103',
        text: 'comment3',
        author: '3',
        post: '101'
    }
]

let posts=[
    {
        id: '101',
        title: 'post1',
        body: 'pewdiepie',
        published: true,
        author: '1',
        comments: ['c101', 'c103']
    },
    {
        id: '102',
        title: 'post2',
        body: 'post2 body',
        published: true,
        author: '2',
        comments: ['c102']
    },
    {
        id: '103',
        title: 'title',
        body: 'body',
        published: true,
        author: '1',
        comments: []
    }
]

const db={
    users,
    posts,
    comments
}

export { db as default }