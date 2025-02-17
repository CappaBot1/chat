const messages: Array<string> = [];

async function handleIt(req: Request): Promise<Response> {
    const reqMethod = req.method;

    console.log("Getting " + reqMethod.toLowerCase() + " request...");

    if (reqMethod == "POST") {
        const data = await req.text();
        console.log(data);

        if (messages.unshift(data) > 10) messages.splice(10 - messages.length);

        return new Response("burger", { status: 200 });
    }

    else if (reqMethod == "GET") {
        return new Response(JSON.stringify(messages));
    }

    return new Response("yeah nah");
}

Deno.serve(handleIt);
