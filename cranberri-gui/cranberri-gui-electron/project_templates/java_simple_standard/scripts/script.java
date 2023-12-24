void setup() {
    log("started!");

    log(myLib.MY_CONSTANT);
    myLib.mySharedMethod();

    disableDebug();
}

void tick() {
    writePin(1, readPin(2));
}