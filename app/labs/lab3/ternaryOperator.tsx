export default function TernaryOperator () {
    let LoggedIn = true;

    return (
        <div id = "wd-ternary-operator">
            <h4> Logged In </h4>
            { LoggedIn ? <o> Welcome </o> : <p> Please Login </p> } <hr />
        </div>
    );
}