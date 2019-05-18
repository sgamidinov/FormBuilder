export default function Compose() {
    const funcArray = Array.from(arguments);
    const funcCount = funcArray.length;

    return value => {
        let result = value;

        for (let i = 0; i < funcCount; i++) {
            result = funcArray[i](result);
        }

        return result;
    }
}
