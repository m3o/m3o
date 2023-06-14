export function setSeen(
    resource_type: string,
    resource_id: string
): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch('/api/seen', {
            method: 'POST',
            body: JSON.stringify({ resource_id, resource_type }),
        })
            .then(async (rsp) =>
                rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
            )
            .catch((err) => reject(err))
    })
}
