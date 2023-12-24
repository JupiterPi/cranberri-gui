fun setup() {
    log("started!")

    pinMode(1, OUTPUT)
    pinMode(2, INPUT)

    log(MY_CONSTANT)
    mySharedMethod()

    disableDebug()
}

fun tick() {
    writePin(1, readPin(2))
}