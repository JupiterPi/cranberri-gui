package com.example.project1;

import jupiterpi.cranberri.runtime.api.*;
import com.example.project1.shared.*;

@Script
class MyScript {
    @Setup
    public void setup() {
        IO.log("started!");
        IO.log(MySingleton.MY_CONSTANT);
        IO.disableDebug();
    }

    @Tick
    public void tick() {
        IO.writePin(1, IO.readPin(2));
    }
}