void setup() {
    log("started!");

    pinMode(1, OUTPUT);
    pinMode(2, INPUT);

    log(myLib.MY_CONSTANT);
    myLib.mySharedMethod();

    disableDebug();
}

void tick() {
    writePin(1, readPin(2));
}