fun setup() {
    log("started!")

    log(MY_CONSTANT)
    mySharedMethod()

    disableDebug()
}

fun tick() {
    writePin(1, readPin(2))
}