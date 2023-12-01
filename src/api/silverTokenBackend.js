const silverTokenBackend = "https://silvertoken-backend.herokuapp.com/";
const slvdToSlvd = "api/proofs/slvd/convert/";
const slvtToSlvd = "api/proofs/slvt/convert/";
const dummyAddress = "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326";

export async function getSlvtSlvdPrice(amount, sellSlvt) {
    console.log(`enter getSlvtSlvdPrice}`);
    const result = sellSlvt ?
        await getSignatureSlvtToSlvd(dummyAddress, amount) :
        await getSignatureSlvdToSlvt(dummyAddress, amount);
    console.log('Debug ====> Result Response: ', result)
    console.log('Debug ====> Price: ', parseFloat(result.slvdAmount) / parseFloat(result.slvtAmount))
    return parseFloat(result.slvdAmount) / parseFloat(result.slvtAmount);
}

export async function getSignatureSlvtToSlvd(address, amount) {
    console.log("enter callGetSignatureSlvdToSlvt");
    console.log(`${silverTokenBackend}${slvtToSlvd}${address}/${amount}`);
    const result = await fetch(
        `${silverTokenBackend}${slvtToSlvd}${address}/${amount}`
    );
    return await result.json();
}

export async function getSignatureSlvdToSlvt(address, amount) {
    console.log("enter callGetSignatureSlvdToSlvt zzz");
    const result = await fetch(
        `${silverTokenBackend}${slvdToSlvd}${address}/${amount}`
    );
    return await result.json();
}