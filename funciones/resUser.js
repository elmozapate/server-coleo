const FresUser = (variables,user, register, userReq, userin,usersPos) => {
    let res = (register || userReq) ? true : -1
    let isCorrecto = false
    
    if (userin) {
        res = false
        variables.usuariosIn.map((key, i) => {
            if ((!isCorrecto && (key.usuario === user || key.email === user))) {
                isCorrecto = true
                res = i
                return res
            }
        })
    } else {
        if (register && !userReq) {

            variables.users.map((key, i) => {
                if (!isCorrecto && (key.email === user)) {
                    isCorrecto = true
                    res = 'false'
                    return res
                }
            })
        }
        if (userReq) {

            variables.users.map((key, i) => {

                if (!isCorrecto && (key.usuario === user)) {
                    isCorrecto = true
                    res = 'false'
                    return res
                }
            })
        }
        if (!userReq && !register) {
            console.log(variables.usuarios);
            !usersPos && variables.usuarios.map((key, i) => {
                if ((!isCorrecto && (key.usuario === user || key.email === user))) {
                    isCorrecto = true
                    res = i
                    return res
                }
            })
            usersPos && variables.users.map((key, i) => {
                if ((!isCorrecto && (key.usuario === user || key.email === user))) {
                    isCorrecto = true
                    res = i
                    return res
                }
            })
        }
    }

    return res
}
module.exports=FresUser
