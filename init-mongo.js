db = db.getSiblingDB('admin')
db.auth('root', 'root')
db.createUser({
  user: 'sapia',
  pwd: 'sapia',
  roles: [{ role: 'readWrite', db: 'sapia' }],
})
