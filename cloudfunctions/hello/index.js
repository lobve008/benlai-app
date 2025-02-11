exports.main = async (event, context) => {
  return {
    code: 200,
    data: `Hello ${event.name || 'World'}!`,
    openid: context.OPENID
  }
}