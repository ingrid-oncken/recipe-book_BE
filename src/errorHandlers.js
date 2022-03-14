export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === 'ValidationError') {
    res.status(400).send(err.error)
  } else {
    next(err)
  }
}

export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({
      status: 'error',
      message: err.message || '401: You are not logged in!',
    })
  } else {
    next(err)
  }
}
export const forbidenHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({
      status: 'error',
      message: err.message || '403: You are not allowed!',
    })
  } else {
    next(err)
  }
}

export const notFoundHandler = (err, req, res, next) => {
  console.log(err)
  if (err.status === 404) {
    res
      .status(404)
      .send({ status: 'error', message: err.message || '404: Not found' })
  } else {
    next(err)
  }
}

export const catchAllHandler = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({
      status: 'error',
      message: '500: Generic Server Error',
    })
  }
}
